type LiveProps = {
    isLive?: boolean,
    lastUpdated: string
}

export default function LiveIndicator({
    isLive = true,
    lastUpdated
}: LiveProps) {
    return (
        <div className="live-indicator">
            <span className="live-text">{isLive ? "LIVE" : "ENDED" }</span>
            <span className="last-updated">Last updated: {lastUpdated}</span>
        </div>
    );
} 