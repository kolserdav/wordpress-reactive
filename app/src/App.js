// Всё работает, но кто же мог подумать, что водпресс не все ссылки формирует на сервере))))

import React, { useEffect } from 'react';
import './App.css';
import * as parser from 'html2json';
import * as rParser from 'html-react-parser';
import { Helmet } from "react-helmet";
import {
	BrowserRouter,
	Route,
	Switch,
  Link,
  useHistory
} from 'react-router-dom';


function getHelmetElement(val, key) {
  return (
    <Helmet>
      {val}
    </Helmet>
  );
}

function parseHead(head) {

  const items = head.child[0].child[0].child;
  const tags = [];
  for (let i = 0; items[i]; i ++) {
    const e = items[i];
    if (e.node !== 'text') {
      let atts = ''; 
      if (e.attr) {
        const { attr } = e;
        for (let ii in attr) {
          atts += `${ii}=${attr[ii]} `
        }
      }
      else {
        atts = '';
      }
      let tag;
      if (e.child) {
        tag = `<${e.tag} ${atts}>${e.child[0].text}</${e.tag}>`
      }
      else {
        tag = `<${e.tag} ${atts}>${e.text}</${e.tag}>`;
      }
      const clTRe = /undefined<\/\w+\>$/;
      tag = tag.replace(clTRe, '');
      tag = rParser(tag);
      tags.push(tag);
    }
    else {

    }
  }
  return getHelmetElement(tags);
}

let _head = false;
let arrRoutes = [];
function changeLinks(body) {
  let newBody = {};
  for (let r in body) {
    if (r === 'props') {
      newBody[r] = {};
      for (let d in body.props) {
        newBody.props[d] = body.props[d];
      }  
    }
    else {
      newBody[r] = body[r];
    }
  }
  if (!body.props) return newBody;
  for (let p in body.props.children) {
    if (Array.isArray(body.props.children)) {
      if (!body.props.children[p]) continue;
      if (!body.props.children[p].type && p) continue;
      if (!body.props.children[p].type === 'text') continue;
      if (body.props.children[p].type === 'a') {
        const eProps = body.props.children[p].props;
        let props = [];
        for (let pp in eProps) {
          if (pp !== 'href') {
            props.push({
              [pp]: eProps[pp]
            });
          }
        }
        newBody.props.children[p] = (
          <Link to="/test" props></ Link>
        );
      }
      else {
        if (!body.props.children[p].props) continue;
        if (body.props.children[p].props.children) {
          newBody.props.children[p] = changeLinks(body.props.children[p]);
        }
      }
    }
    else {
      if (p === 'type' && body.props.children[p] === 'a') {
        const href = body.props.children.props.href;
        let to = '';
        const regServer = /^https?:\/\/wref.loc/
        if (href.match(regServer)) {
          to = href.replace(regServer, '');
          newBody.props.children = (
            <Link to={to} props>{body.props.children.props.children}</ Link>
          );
          arrRoutes.push(<Route path={to}><Home /></Route>)
        }
      }
    }
  }
  return newBody;
}

function Home(props) {
  
  const history = useHistory();
  const [d, setD] = React.useState('');
  const [ head, setHead ] = React.useState();

  useEffect(() => { 
    fetch(`http://localhost:3030/?path=${window.location.pathname}`)
      .then(r => r.json())
      .then(d => {
        const data = d.data;
        const html = parser.html2json(data);
        const ht = rParser(data);
        setHead(parseHead(html));
        const { children } = ht.props;
        let body;
        for (let prop in children) {
          if (children[prop].type === 'body') body = children[prop];
        }
        let newBody = changeLinks(body);
        const E = (props) => (<div {...props.body}></div>);
        setD(<E body={body.props} children={newBody.props.children}/>);
      })
  }, [history.location.pathname]);
  return( <div>
    { head } <div>{d}</div>
    </div>)
}

function App() {
  
  const [d, setD] = React.useState('');
  const [ head, setHead ] = React.useState();
  
  useEffect(() => {
    
  }, [])
	return (
		<BrowserRouter>
         
        <Switch>
          <Home />
        </ Switch>

		</ BrowserRouter>
  );
}

export default App;