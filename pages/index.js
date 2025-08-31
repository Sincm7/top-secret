export async function getServerSideProps(ctx) {
  const cookie = ctx.req.headers.cookie || ''
  const has = cookie.includes('ts_session=')
  return {
    redirect: { destination: has ? '/chat' : '/login', permanent: false }
  }
}

export default function Home() { return null }
