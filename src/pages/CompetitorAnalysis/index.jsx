import React, { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    LinearProgress,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts'
import { syncLargeRange } from '../../services/dataSyncService'
import { analyzeMarketPatterns } from '../../services/analysisService'
import { analyzeCompanyBidPattern } from '../../services/analysis'

const REGIONS = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
]

const BUSINESS_TYPES = [
    { value: 'cnstwk', label: '공사' },
    { value: 'thng', label: '물품' },
    { value: 'servc', label: '용역' },
]

export default function CompetitorAnalysis() {
    // Search Criteria State
    const [startDate, setStartDate] = useState(
        new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0] // 2 months ago
    )
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
    const [businessType, setBusinessType] = useState('cnstwk')
    const [region, setRegion] = useState('')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [analysisMode, setAnalysisMode] = useState('company')
    const [bizno, setBizno] = useState('')
    const [corpNm, setCorpNm] = useState('')
    const [recentLimit, setRecentLimit] = useState(10)

    // Analysis State
    const [marketAnalyzing, setMarketAnalyzing] = useState(false)
    const [companyAnalyzing, setCompanyAnalyzing] = useState(false)
    const [syncing, setSyncing] = useState(false)
    const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0, step: '' })
    const [syncError, setSyncError] = useState(null)
    const [marketError, setMarketError] = useState(null)
    const [companyError, setCompanyError] = useState(null)
    const [result, setResult] = useState(null)
    const [companyResult, setCompanyResult] = useState(null)

    useEffect(() => {
        setResult(null)
        setCompanyResult(null)
        setMarketError(null)
        setCompanyError(null)
    }, [analysisMode])

    // Handler: Data Sync
    const handleSync = async () => {
        setSyncing(true)
        setSyncProgress({ current: 0, total: 0, step: '초기화 중...' })
        setSyncError(null)
        setResult(null)
        setCompanyResult(null)

        try {
            await syncLargeRange({
                startDate,
                endDate,
                businessTypes: [businessType],
                targets: { notices: true, results: true, opening: true, companies: false }, // Explicit MVP scope
                onProgress: (current, total, meta) => {
                    const stepLabel = meta?.step || '처리 중'
                    const chunkLabel = meta?.chunk ? ` (${meta.chunk})` : ''
                    setSyncProgress({ current, total, step: `${stepLabel}${chunkLabel}` })
                },
                onError: (err) => {
                    console.error('Sync Error:', err) // Log but continue if possible
                }
            })
            // Auto-analyze after sync (market mode only)
            if (analysisMode === 'market') {
                handleAnalyze()
            }
        } catch (err) {
            console.error('Fatal Sync Error:', err)
            setSyncError(err.message || '데이터 동기화 중 오류가 발생했습니다.')
        } finally {
            setSyncing(false)
        }
    }

    // Handler: Analyze
    const handleAnalyze = async () => {
        setMarketAnalyzing(true)
        setMarketError(null)
        try {
            const analysisResult = await analyzeMarketPatterns({
                type: businessType,
                region,
                minPrice: minPrice ? Number(minPrice) : null,
                maxPrice: maxPrice ? Number(maxPrice) : null,
                limit: 100 // Sample size
            })
            setResult(analysisResult)
        } catch (err) {
            console.error('Analysis Error:', err)
            setMarketError('분석 중 오류가 발생했습니다.')
        } finally {
            setMarketAnalyzing(false)
        }
    }

    const handleAnalyzeCompany = async () => {
        const normalizedBizno = bizno.replace(/\D/g, '').trim()
        const normalizedName = corpNm.trim()

        if (!normalizedBizno && !normalizedName) {
            setCompanyError('사업자번호 또는 업체명을 입력해주세요.')
            return
        }
        if (normalizedBizno && normalizedBizno.length !== 10) {
            setCompanyError('사업자번호는 숫자 10자리로 입력해주세요.')
            return
        }

        const limit = Number(recentLimit)
        const finalLimit = Number.isFinite(limit) && limit > 0 ? limit : 10

        setCompanyAnalyzing(true)
        setCompanyError(null)
        setCompanyResult(null)

        try {
            const analysisResult = await analyzeCompanyBidPattern({
                bizno: normalizedBizno || undefined,
                corpNm: normalizedName || undefined,
                recentLimit: finalLimit,
            })
            setCompanyResult(analysisResult)
        } catch (err) {
            console.error('Company Analysis Error:', err)
            setCompanyError(err?.message || '업체 분석 중 오류가 발생했습니다.')
        } finally {
            setCompanyAnalyzing(false)
        }
    }

    const formatRate = (val, digits = 3) => {
        if (val === null || val === undefined || val === '') return '-'
        const num = typeof val === 'number'
            ? val
            : Number(String(val).replace('%', '').replace(/,/g, '').trim())
        return Number.isFinite(num) ? `${num.toFixed(digits)}%` : '-'
    }
    const formatMoney = (val) => {
        if (val === null || val === undefined || val === '') return '-'
        const num = Number(String(val).replace(/,/g, '').trim())
        return Number.isFinite(num) ? `${num.toLocaleString()}원` : '-'
    }
    const isAnalyzing = marketAnalyzing || companyAnalyzing

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Button
                    variant={analysisMode === 'company' ? 'contained' : 'outlined'}
                    onClick={() => setAnalysisMode('company')}
                >
                    업체 분석
                </Button>
                <Button
                    variant={analysisMode === 'market' ? 'contained' : 'outlined'}
                    onClick={() => setAnalysisMode('market')}
                >
                    시장 분석
                </Button>
            </Stack>

            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                {analysisMode === 'company' ? '경쟁사 투찰 성향 분석 (MVP)' : '시장 투찰 패턴 분석 (MVP)'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {analysisMode === 'company'
                    ? '업체별 투찰 습관/분포를 분석하여 경쟁자들의 경향을 파악합니다.'
                    : '시장 전체의 투찰 분포를 분석하여 최적의 투찰 구간을 예측합니다.'}
            </Typography>

            {/* 1. Filter + Sync Section */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="시작일"
                            type="date"
                            fullWidth
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <TextField
                            label="종료일"
                            type="date"
                            fullWidth
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>업무 구분</InputLabel>
                            <Select
                                value={businessType}
                                label="업무 구분"
                                onChange={(e) => setBusinessType(e.target.value)}
                            >
                                {BUSINESS_TYPES.map((t) => (
                                    <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    {analysisMode === 'market' && (
                        <>
                            <Grid item xs={6} md={2}>
                                <FormControl fullWidth>
                                    <InputLabel>지역 (옵션)</InputLabel>
                                    <Select
                                        value={region}
                                        label="지역 (옵션)"
                                        displayEmpty
                                        onChange={(e) => setRegion(e.target.value)}
                                    >
                                        <MenuItem value="">전체</MenuItem>
                                        {REGIONS.map((r) => (
                                            <MenuItem key={r} value={r}>{r}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    label="최소 예가 (원)"
                                    fullWidth
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="예: 100000000"
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    label="최대 예가 (원)"
                                    fullWidth
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="예: 500000000"
                                />
                            </Grid>
                        </>
                    )}
                    {analysisMode === 'company' && (
                        <>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="사업자번호 (10자리)"
                                    fullWidth
                                    value={bizno}
                                    onChange={(e) => setBizno(e.target.value)}
                                    placeholder="숫자만 입력"
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    label="업체명 (대체 입력)"
                                    fullWidth
                                    value={corpNm}
                                    onChange={(e) => setCorpNm(e.target.value)}
                                    placeholder="예: 한국건설"
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    label="최근 입찰 수"
                                    fullWidth
                                    type="number"
                                    value={recentLimit}
                                    onChange={(e) => setRecentLimit(e.target.value)}
                                    placeholder="예: 10"
                                />
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            color="warning"
                            onClick={handleSync}
                            disabled={syncing || isAnalyzing}
                        >
                            {syncing ? '데이터 동기화 중...' : '데이터 동기화 (최신화)'}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={analysisMode === 'company' ? handleAnalyzeCompany : handleAnalyze}
                            disabled={syncing || isAnalyzing}
                        >
                            {isAnalyzing
                                ? '분석 중...'
                                : analysisMode === 'company'
                                    ? '업체 분석 실행'
                                    : '패턴 분석 시작'}
                        </Button>
                    </Grid>
                </Grid>

                {syncing && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                            {syncProgress.step} ({syncProgress.current}/{syncProgress.total > 0 ? syncProgress.total : '?'})
                        </Typography>
                        <LinearProgress variant={syncProgress.total > 0 ? "determinate" : "indeterminate"} value={syncProgress.total > 0 ? (syncProgress.current / syncProgress.total) * 100 : 0} />
                    </Box>
                )}
                {syncError && <Alert severity="error" sx={{ mt: 2 }}>{syncError}</Alert>}
                {analysisMode === 'market' && marketError && (
                    <Alert severity="error" sx={{ mt: 2 }}>{marketError}</Alert>
                )}
                {analysisMode === 'company' && companyError && (
                    <Alert severity="error" sx={{ mt: 2 }}>{companyError}</Alert>
                )}
            </Card>

            {/* 2. Analysis Result Section */}
            {analysisMode === 'market' && result && (
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>분석 표본</Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {result.analyzedNoticeCount}<span style={{ fontSize: '0.6em' }}>건 (공고)</span>
                                </Typography>
                                <Typography variant="caption">
                                    총 {result.totalBidsAnalyzed.toLocaleString()}개 투찰 데이터
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography color="primary" gutterBottom>평균 투찰률</Typography>
                                <Typography variant="h4" fontWeight="bold" color="primary">
                                    {formatRate(result.stats?.mean)}
                                </Typography>
                                <Typography variant="caption">
                                    중앙값: {formatRate(result.stats?.median)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', bgcolor: '#fff3e0' }}>
                            <CardContent>
                                <Typography color="orange" gutterBottom>최빈 구간 (몰림)</Typography>
                                <Typography variant="h4" fontWeight="bold" color="orange">
                                    {result.topRanges[0] ? result.topRanges[0].range : '-'}
                                </Typography>
                                <Typography variant="caption">
                                    빈도: {result.topRanges[0] ? result.topRanges[0].count.toLocaleString() : 0}회
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ height: '100%', bgcolor: '#f3e5f5' }}>
                            <CardContent>
                                <Typography color="secondary" gutterBottom>변동성 (표준편차)</Typography>
                                <Typography variant="h4" fontWeight="bold" color="secondary">
                                    {result.stats?.stdDev?.toFixed(4)}
                                </Typography>
                                <Typography variant="caption">
                                    낮을수록 좁은 구간에 집중됨
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Chart Section */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>투찰률 분포 히스토그램</Typography>
                                <Box sx={{ height: 400, width: '100%' }}>
                                    {result.histogram.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={result.histogram} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="range" label={{ value: '투찰률 구간', position: 'insideBottom', offset: -5 }} />
                                                <YAxis label={{ value: '빈도(건)', angle: -90, position: 'insideLeft' }} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" name="투찰 건수" fill="#3f51b5" />
                                                {result.stats?.mean && <ReferenceLine x={result.stats.mean} stroke="red" label="평균" />}
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <Typography color="textSecondary">데이터가 부족하여 그래프를 그릴 수 없습니다.</Typography>
                                        </Box>
                                    )}
                                </Box>
                                {result.topRanges.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="subtitle2" gutterBottom>🔥 TOP 3 집중 구간 (Recommendation)</Typography>
                                        <Stack direction="row" spacing={1}>
                                            {result.topRanges.map((r, i) => (
                                                <Chip
                                                    key={i}
                                                    label={`${i + 1}순위: ${r.range} (${r.count}건)`}
                                                    color={i === 0 ? "error" : "default"}
                                                    variant={i === 0 ? "filled" : "outlined"}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Similar Notices Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>공고번호</TableCell>
                                            <TableCell>공고명</TableCell>
                                            <TableCell>기초금액</TableCell>
                                            <TableCell>개찰일</TableCell>
                                            <TableCell>관할지역</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {result.recentNotices.map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.bidNtceNo}>
                                                <TableCell component="th" scope="row">{row.bidNtceNo}</TableCell>
                                                <TableCell>{row.bidNtceNm}</TableCell>
                                                <TableCell>{formatMoney(row.bssamt)}</TableCell>
                                                <TableCell>{row.opengDt || row.rgstDt}</TableCell>
                                                <TableCell>{row.dminsttNm}</TableCell>
                                            </TableRow>
                                        ))}
                                        {result.recentNotices.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">유사 공고 내역이 없습니다.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {analysisMode === 'company' && companyResult && (
                <Grid container spacing={3}>
                    {/* Summary Cards */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', bgcolor: '#f5f5f5' }}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>업체 정보</Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {companyResult.corpNm}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    사업자번호: {companyResult.bizno || '-'}
                                </Typography>
                                {companyResult.details?.company?.rgnNm && (
                                    <Typography variant="body2">
                                        지역: {companyResult.details.company.rgnNm}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', bgcolor: '#e3f2fd' }}>
                            <CardContent>
                                <Typography color="primary" gutterBottom>투찰 성향 요약</Typography>
                                <Typography variant="h5" fontWeight="bold" color="primary">
                                    {companyResult.profile?.label || '분석 불가'}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    공격성: {Number.isFinite(companyResult.profile?.aggressiveness)
                                        ? `${companyResult.profile.aggressiveness}`
                                        : '-'}
                                </Typography>
                                <Typography variant="body2">
                                    일관성: {Number.isFinite(companyResult.profile?.consistency)
                                        ? `${companyResult.profile.consistency}`
                                        : '-'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ height: '100%', bgcolor: '#fff3e0' }}>
                            <CardContent>
                                <Typography color="orange" gutterBottom>성과 요약</Typography>
                                <Typography variant="h5" fontWeight="bold" color="orange">
                                    승률 {formatRate(companyResult.stats?.winRate, 2)}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    총 투찰 {companyResult.stats?.totalBids ?? 0}건 / 낙찰 {companyResult.stats?.wonBids ?? 0}건
                                </Typography>
                                <Typography variant="body2">
                                    평균 투찰률 {formatRate(companyResult.stats?.avgBidRate, 3)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Distribution Chart */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>투찰률 분포</Typography>
                                <Box sx={{ height: 360, width: '100%' }}>
                                    {companyResult.bidRateDistribution?.length ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={companyResult.bidRateDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="range" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="count" name="투찰 건수" fill="#3f51b5" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <Typography color="textSecondary">분포 데이터가 부족합니다.</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Pattern Charts */}
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>월별 참여 패턴</Typography>
                                <Box sx={{ height: 280, width: '100%' }}>
                                    {companyResult.monthlyPattern?.length ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={companyResult.monthlyPattern} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="month" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" name="참여 건수" fill="#4caf50" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <Typography color="textSecondary">월별 데이터가 부족합니다.</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>시간대 참여 패턴</Typography>
                                <Box sx={{ height: 280, width: '100%' }}>
                                    {companyResult.hourlyPattern?.length ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={companyResult.hourlyPattern} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="hour" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="count" name="참여 건수" fill="#ff7043" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                                            <Typography color="textSecondary">시간대 데이터가 부족합니다.</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Recent Bids Table */}
                    <Grid item xs={12}>
                        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                            <TableContainer sx={{ maxHeight: 440 }}>
                                <Table stickyHeader aria-label="sticky table" size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>공고번호</TableCell>
                                            <TableCell>공고명</TableCell>
                                            <TableCell>투찰률</TableCell>
                                            <TableCell>순위</TableCell>
                                            <TableCell>개찰일</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {companyResult.recentBids?.map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id || row.bidNtceNo}>
                                                <TableCell>{row.bidNtceNo || '-'}</TableCell>
                                                <TableCell>{row.bidNtceNm || '-'}</TableCell>
                                                <TableCell>{formatRate(Number(row.bidprcRate), 3)}</TableCell>
                                                <TableCell>{row.opengRank || '-'}</TableCell>
                                                <TableCell>{row.opengDt || row.rlOpengDt || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                        {(!companyResult.recentBids || companyResult.recentBids.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">최근 투찰 내역이 없습니다.</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Container>
    )
}
