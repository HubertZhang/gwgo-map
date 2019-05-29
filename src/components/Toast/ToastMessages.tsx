import * as React from "react";

import * as style from "./Toast.scss";

interface IToast {
    content: string;
    expired: number;
}

export class ToastMessages extends React.Component<{}, { toasts: IToast[] }> {
    public state = {
        toasts: [],
    };
    public timer: any;
    public componentDidMount = () => {

        // componentDidMount is called by react when the component
        // has been rendered on the page. We can set the interval here:

        this.timer = setInterval(this.tick, 500);
    }

    public tick = () => {
        const now = new Date().getTime();
        this.setState((state) => {
            return {
                toasts: [...state.toasts.filter((t) => (t.expired > now))],
            };
        });
    }

    public addToast(t: string, timeout: number = 5000) {
        this.setState((state) => {
            return { toasts: [...state.toasts, { content: t, expired: ((new Date()).getTime() + timeout) }] };
        });
    }

    public render() {
        return <div className={style["toast-messages"]}><ul>
            {this.state.toasts.map((t) => {
                return <li key={t.expired} className={style["toast-entry"]}>{t.content}</li>;
            })}
        </ul></div>;
    }
}
