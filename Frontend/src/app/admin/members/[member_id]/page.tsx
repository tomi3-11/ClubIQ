import PageShell from "@/components/reusables/PageShell";

type paramType = {
  member_id: string;
};
export default async function MembersPage({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { member_id } = (await params) as paramType;

  return (
    <PageShell>
      <div>
        <h1>See an individual member's details</h1>
        <span>Member ID: {member_id}</span>
      </div>
    </PageShell>
  );
}
