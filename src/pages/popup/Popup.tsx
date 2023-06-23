import "@pages/popup/Popup.css";

import AppBar from "@components/AppBar";
import Drawer from "@components/Drawer";
import Main from "@routes/Main";
import { useState } from "react";
import { Link, Redirect, Route, Router, Switch } from "wouter";
import makeMatcher from "wouter/matcher";

const defaultMatcher = makeMatcher();

/*
 * A custom routing matcher function that supports multipath routes
 */
const multipathMatcher = (patterns, path) => {
  for (const pattern of [patterns].flat()) {
    const [match, params] = defaultMatcher(pattern, path);
    if (match) return [match, params];
  }
  return [false, null];
};

const popupHomePage = "/src/pages/popup/index.html";
const newtabHomePage = "/src/pages/newtab/index.html";
const homeMultiPath = [popupHomePage, newtabHomePage];

const Popup = () => {
  const [draweOpen, setDrawerOpen] = useState(false);

  return (
    <Router matcher={multipathMatcher as any}>
      <header>
        <AppBar {...{ draweOpen, setDrawerOpen }} />
        <nav>
          <Drawer {...{ draweOpen, setDrawerOpen }} />
        </nav>
      </header>
      <main>
        <Switch>
          <Route path={homeMultiPath as any}>
            <Main />
          </Route>
          <Route path="/">
            <Redirect to={popupHomePage} />
          </Route>
          <Route path="/about">
            <Link href="/">
              <a className="link">home</a>
            </Link>
          </Route>
          <Route path="/:anything*">
            <b>404:</b> {"Sorry, this page isn't ready yet!"}
          </Route>
        </Switch>
      </main>
    </Router>
  );
};

export default Popup;
