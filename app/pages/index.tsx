import { getData } from './lib'
import Component from './[...component]'

export async function getServerSideProps(context) {

  const data: any = await getData(context);

  return {
    props: {
      head: data.head,
      html: data.html
    }
  }
}


export default function Home({head, html}) {
  
  

  return (
    <Component head={head} html={html} />
  )
}
