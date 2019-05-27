import * as React from "react";

import { SpriteConfig } from "@config/SpriteData";
import { connect, DispatchProp } from "react-redux";
import YaolingEntry from "./YaolingEntry";

import { setDisplayedYaolingIDs } from "@action/global";

const YaolingIDs = Array.from(SpriteConfig.keys());

type IProps = (
    DispatchProp &
    ReturnType<typeof mapStateToProps>
);

class YaolingFilterList extends React.Component<IProps, { selected: Set<number> }> {
    public yaolingClicked = (id: number) => {
        if (this.state.selected.has(id)) {
            const newSelected = new Set<number>(this.state.selected);
            newSelected.delete(id);
            this.setState({
                selected: newSelected,
            });
        } else {
            this.setState({
                selected: new Set<number>(this.state.selected).add(id),
            });
        }
    }

    public componentWillMount() {
        const storage = localStorage.getItem("DisplayedYaolingIDs");
        if (storage) {
            this.setState({
                selected: new Set<number>(JSON.parse(storage) as number[]),
            });
        } else {
            this.setState({
                selected: new Set<number>(SpriteConfig.keys()),
            });
        }
    }

    public componentWillUnmount() {
        localStorage.setItem("DisplayedYaolingIDs", JSON.stringify([...this.state.selected.values()]));
        this.props.dispatch(setDisplayedYaolingIDs([...this.state.selected.values()]));
    }

    public componentWillReceiveProps() {
        console.log("filter updated");
    }

    public render() {
        return <React.Fragment>
            <ol>
                {
                    YaolingIDs.map(
                        (key) => <YaolingEntry key={key} sprite={SpriteConfig.get(key)}
                            checked={this.state.selected.has(key)}
                            onClick={this.yaolingClicked} />,
                    )
                }
            </ol>
        </React.Fragment>;
    }
}

const mapStateToProps = () => ({
    // selected: state.filterState.yaolingIds,
});

export default connect(mapStateToProps)(YaolingFilterList);
