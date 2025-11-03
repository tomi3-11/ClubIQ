type paramType = {
  club_id: string;
};
export default async function ClubPage({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { club_id } = (await params) as paramType;

  return <>Club ID: {club_id}</>;
}
