// Всё работает, но кто же мог подумать, что водпресс не все ссылки формирует на сервере))))

import React, { useEffect } from 'react';
import * as parser from 'html2json';
import * as rParser from 'html-react-parser';
import { Helmet } from "react-helmet";
import {
	BrowserRouter,
	Route,
	Switch,
  Link,
  useHistory,
  StaticRouter
} from 'react-router-dom';
import { createMemoryHistory } from 'history';
const isServer = typeof window === 'undefined';
import Body from './body';




const Home = () => {
  const history = createMemoryHistory();

  useEffect(() => {
    
  }, [])
  
  if (isServer) {

    return (
      <StaticRouter>
        <Switch>
          <Body/>
        </Switch>
		</ StaticRouter>
    );
  }
	return (
		<BrowserRouter>
        <Switch>
          <Body/>
        </Switch>
		</ BrowserRouter>
  );
}

export default Home;