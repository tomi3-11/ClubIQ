import Link from "next/link";

export default function LinksRow({ isAdmin }: { isAdmin?: boolean }) {
  const prefix = isAdmin ? "/admin/" : "/member/";

  return (
    <div className='dashboard-tabs'>
      <Link className='tab' href={`${prefix}dashboard`}>
        Dashboard
      </Link>
      <Link className='tab' href={`${prefix}activities`}>
        Activities
      </Link>
      {isAdmin && (
        <>
          <Link className='tab' href={`${prefix}members`}>
            Members
          </Link>
          <Link className='tab' href={`${prefix}ratings`}>
            Ratings
          </Link>
          <Link className='tab' href={`${prefix}reports`}>
            Reports
          </Link>
        </>
      )}
    </div>
  );
}
