
import { TrashIcon } from "components/Icons";
import { Button } from "components/Inputs/Button";
import { MetadataBox } from "./AutomationMetadataBox";
import { AutomationData } from "types/automations";
import { AutomationGrouper } from "./automationGrouper";



export const convertGroupsToItems = (
    autos: Array<[AutomationData, number]>,
    groups: AutomationGrouper,
    currentNode: number,
    onSelectAutomation: (i: number) => void,
    onRemove: (i: number) => void,
) => {
    if (Array.isArray(groups)) {
        return groups.map(i => {
            const [auto, autoIndex] = autos[i];
            let title = "BadAuto<<Missing Metadata>>"
            if (auto.metadata) {
                title = `Name = ${auto.metadata.alias}\nID = ${auto.metadata.id}\nDescription = ${auto.metadata.description}`
            }
            return <div
                key={i}
                className={["automation-list-box--body--item", selected === autoIndex ? 'selected' : ''].join(' ')}
                title={title}
                onClick={() => onSelectAutomation(autoIndex)}
            >
                <MetadataBox metadata={auto.metadata} tags={auto.tags} />
                <Button onClick={() => onRemove(autoIndex)}><TrashIcon /></Button>
            </div>
        })
    } else {
        return Object.keys(groups).sort((a, b) => {
            if (!a) {
                return 1
            }
            return a < b ? 1 : -1
        }).map(groupName => {
            return <AutomationListBoxGroup
                key={groupName}
                groupName={groupName}
                groups={groups[groupName]}
                autos={autos}
                onSelectAutomation={onSelectAutomation}
                onRemove={onRemove}
                selected={selected}
            />
        })
    }
}
