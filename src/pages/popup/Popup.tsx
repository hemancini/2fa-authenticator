import "@pages/popup/Popup.css";

import AppBar from "@components/AppBar";
import Drawer from "@components/Drawer";
import Entries from "@routes/Entries";
import EntriesEdit from "@routes/EntriesEdit";
import { EntriesContextProvider } from "@src/contexts/Entries";
import { useState } from "react";
import { Link, Redirect, Route, Router, Switch } from "wouter";

const popupHomePage = "/src/pages/popup/index.html";

const Popup = () => {
  const [draweOpen, setDrawerOpen] = useState(false);

  return (
    <EntriesContextProvider>
      <Router>
        <header>
          <AppBar {...{ draweOpen, setDrawerOpen }} />
          <Drawer {...{ draweOpen, setDrawerOpen }} />
        </header>
        <Switch>
          <Route path="/">
            <Redirect to={popupHomePage} />
          </Route>
          <Route path={popupHomePage}>
            <Entries />
          </Route>
          <Route path="/entries/edit">
            <EntriesEdit />
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
      </Router>
    </EntriesContextProvider>
  );
};

export default Popup;
