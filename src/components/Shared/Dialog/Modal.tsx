import * as React from "react";
import * as ReactDOM from "react-dom";

import classNames from "classnames";
import * as style from "./Dialog.scss";

interface IProps {
    className?: string;
}

class Modal extends React.Component<IProps> {
    private container = document.createElement("div");

    public componentDidMount() {
        document.body.appendChild(this.container);
        this.container.className = classNames(style.background, this.props.className);
    }

    public componentWillUnmount() {
        document.body.removeChild(this.container);
    }

    public render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.container,
        );
    }
}

export default Modal;
