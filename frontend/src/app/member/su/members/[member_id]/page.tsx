import PageShell from "@/components/reusables/PageShell";

type paramType = {
  member_id: string;
};

export default async function MemberPageById({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { member_id } = (await params) as paramType;

  return (
    <PageShell>
      <div>Club Page for Club ID: {member_id}</div>
    </PageShell>
  );
}
