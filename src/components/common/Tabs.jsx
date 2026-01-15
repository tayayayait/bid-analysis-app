import './Tabs.css'

/**
 * 탭 컴포넌트
 * @param {Object} props
 * @param {Array<{id: string, label: string, icon?: React.ReactNode}>} props.tabs - 탭 목록
 * @param {string} props.activeTab - 현재 활성 탭 ID
 * @param {function} props.onTabChange - 탭 변경 콜백
 * @param {React.ReactNode} props.children - 탭 콘텐츠 (선택적)
 */
function Tabs({
    tabs,
    activeTab,
    onTabChange,
    className = '',
}) {
    return (
        <div className={`tabs ${className}`}>
            <div className="tabs-list" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        role="tab"
                        className={`tab-item ${activeTab === tab.id ? 'tab-item-active' : ''}`}
                        onClick={() => onTabChange(tab.id)}
                        aria-selected={activeTab === tab.id}
                    >
                        {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
                <div
                    className="tabs-indicator"
                    style={{
                        width: `${100 / tabs.length}%`,
                        transform: `translateX(${tabs.findIndex(t => t.id === activeTab) * 100}%)`
                    }}
                />
            </div>
        </div>
    )
}

/**
 * 업무 구분 탭 (공사, 물품, 용역, 외자)
 */
function BusinessTypeTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'cnstwk', label: '공사' },
        { id: 'thng', label: '물품' },
        { id: 'servc', label: '용역' },
        { id: 'frgcpt', label: '외자' },
    ]

    return (
        <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
        />
    )
}

export { Tabs, BusinessTypeTabs }
export default Tabs
