import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import IndexPage from './routes/Index/IndexPage';
import LayoutR from "./routes/Layout/Layout_R";
import MI0103R from "./routes/MI/MI0103R";
import {IntlProvider, addLocaleData} from "react-intl";
import {LocaleProvider} from "antd";
import RememberPasswordR from "./routes/Index/RemeberPasswordR";

function RouterConfig({history}) {
    addLocaleData(window.appLocale.data);
    return (
        <LocaleProvider locale={window.appLocale.antd}>
            <IntlProvider locale={window.appLocale.locale} messages={window.appLocale.messages}>
                <Router history={history}>
                    <Switch>
                        <Route exact path="/" component={IndexPage}/>
                        <Route exact path="/rememberPwd" component={RememberPasswordR}/>
                        <Route exact path="/main/mi0103" component={MI0103R}/>
                        <LayoutR/>
                    </Switch>
                </Router>
            </IntlProvider>
        </LocaleProvider>
    );
}

export default RouterConfig;