import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from "react"
import Image from "next/image"

export async function getServerSideProps(context: any) {
  try {
    await clientPromise

    return {
      props: { isConnected: true },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const [data, setData] = useState<any>();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`/api/movies?page=${page}`);
      const result = await res.json();
      setData(result);
    }

    fetchData();
  }, [page]);

  console.log(data)

  {isConnected ? console.log("MongoDB database connected") : console.log("MongoDB connection failed")}

  const increment = () => {
    setPage(page + 1);
    if(page === 100) setPage(1);
  }

  const decrement = () => {
    setPage(page - 1);
    if(page === 1) setPage(100);
  }

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="test">
        <div>
          <button onClick={() => decrement()}>Previous Page</button>
          <button onClick={() => increment()}>Next Page</button>
          <h3>Page: {page}</h3>
        </div>
        <div className="container">
          {data?.map(((item:any, idx:number)  => (
          <div className="movie" key={idx}>
            <Image src={item?.poster || "/1v41wj1k8rneqg3j67ct.png"} alt="" fill priority />
            <div className="desc">
              <div className="content">
                <h1>{item?.fullplot || item?.plot || item?.title}</h1>
              </div>
            </div>
          </div>
        )))}
        </div>
      </div>

      <style jsx>{`
        .container {
          padding: 1rem;
          display: grid;
          height: 98%;
          gap: 2ch;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          
        }

        .movie {
          width: 100%;
          height: 55vh;
          background: #91a4ce;
          padding: 1.5rem;
          position: relative;
          border: 5px solid black;
          border-radius: 5px;
          overflow: hidden;
        }

        .desc {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          cursor: pointer;
        }

        .content {
          width: 100%;
          height: 100%;
          background: #313131e8;
          font-size: .6em;
          display: flex;
          justify-content: center;
          color: white;
          padding: 1rem;
          overflow: auto;
        }

        .movie:hover .desc {
          display: inherit;
        }

        
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
