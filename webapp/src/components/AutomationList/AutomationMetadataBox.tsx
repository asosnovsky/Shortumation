import { FC } from "react"
import { AutomationMetadata } from "types/automations"

export const MetadataBox: FC<{
    metadata: AutomationMetadata,
    tags: Record<string, string>,
}> = (auto) => {
    let title = <span>{"BadAuto<<Missing Metadata>>"}</span>
    if (auto.metadata) {
        title = <>
            <b>{String(auto.metadata.alias ?? "").slice(0, 15)} <span>({String(auto.metadata.id).slice(0, 5)})</span></b>
            <span>{String(auto.metadata.description ?? "").slice(0, 25)}</span>
        </>
    }
    return <div
        className="automation-list-box--body--item--title"
    >
        {title}
        <div
            className="automation-list-box--body--item--tags"
        >
            {Object.keys(auto.tags).map(tagName => <span key={tagName}>
                <b>{tagName}:</b> {auto.tags[tagName]}
            </span>)}
        </div>
    </div>
}
