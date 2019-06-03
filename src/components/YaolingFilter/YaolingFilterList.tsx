import * as React from "react";

import { CommonSpriteID, SpriteConfig } from "@config/SpriteData";
import { connect, DispatchProp } from "react-redux";
import YaolingEntry from "./YaolingEntry";

import { setDisplayedYaolingIDs } from "@action/global";

import * as style from "./YaolingEntry.scss";

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

    public displayAll = () => {
        this.setState({
            selected: new Set<number>(SpriteConfig.keys()),
        });
    }

    public hideAll = () => {
        this.setState({
            selected: new Set<number>(),
        });
    }

    public hideCommon = () => {
        const n = new Set<number>(this.state.selected);
        for (const id of CommonSpriteID) {
            n.delete(id);
        }
        this.setState({
            selected: n,
        });
    }

    public render() {
        return <React.Fragment>
            <ol className={style.YaolingFilterList}>
                <div className={style.YaolingFilterButtons}>
                    <div onClick={this.displayAll}>全部显示</div>
                    <div onClick={this.hideAll}>全部隐藏</div>
                    <div onClick={this.hideCommon}>隐藏常见妖灵</div>
                </div>
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
