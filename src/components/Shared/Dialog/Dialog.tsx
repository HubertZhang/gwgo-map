import * as React from "react";

import classNames from "classnames";
import * as style from "./Dialog.scss";
import Modal from "./Modal";

interface IProps {
    hidden?: boolean;
    className?: string;
    title: string;
    onClosed?(): void;
}

class Dialog extends React.PureComponent<IProps> {
    public render() {
        if (this.props.hidden) {
            return null;
        }
        return (
            <Modal>
                <section className={classNames(style.dialog, this.props.className)}>
                    <header>
                        <h1 className={style.title}>{this.props.title!}</h1>
                        <div className={style.close}><a onClick={() => { this.props.onClosed(); }}>X</a></div>
                    </header>
                    <div className={style.content}>{this.props.children}</div>
                </section>
            </Modal>
        );
    }
}

export default Dialog;
