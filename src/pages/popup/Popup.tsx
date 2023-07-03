import "@pages/popup/Popup.css";

import AppBar from "@components/AppBar";
import DrawerMenu from "@src/components/DrawerMenu";
import Entries from "@routes/Entries";
import EntriesEdit from "@routes/EntriesEdit";
import { EntriesProvider } from "@src/contexts/Entries";
import { OptionsProvider } from "@src/contexts/Options";
import { useState } from "react";
import { Link, Redirect, Route, Router, Switch } from "wouter";

const popupHomePage = "/src/pages/popup/index.html";

const Popup = () => {
  const [draweOpen, setDrawerOpen] = useState(false);

  return (
    <OptionsProvider>
      <EntriesProvider>
        <Router>
          <header>
            <AppBar {...{ draweOpen, setDrawerOpen }} />
            <DrawerMenu {...{ draweOpen, setDrawerOpen }} />
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
      </EntriesProvider>
    </OptionsProvider>
  );
};

export default Popup;
