import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "@components/App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { store } from "./store";

ReactDOM.render (
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root"),
);

serviceWorker.register();
