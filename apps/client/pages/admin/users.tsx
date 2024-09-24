import { InboxNav } from "@/components/inbox/MailNav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUsers } from "@/lib/api/admin/useUsers";

const Users = () => {
  const { data: users } = useUsers();

  return (
    <main className="flex h-[100dvh] w-full">
      <InboxNav />

      <div className="container flex flex-col gap-4 py-12">
        <h1 className="text-3xl font-bold">Users</h1>

        <Table>
          <TableHeader>
            <TableHead>ID</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Admin?</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
          </TableHeader>

          <TableBody>
            {users?.length === 0 && <span>No users</span>}

            {users?.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-mono">{u.id.substr(-8)}</TableCell>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.is_admin ? "Yes" : "No"}</TableCell>
                <TableCell>{u.created_at}</TableCell>
                <TableCell>{u.updated_at || "not set"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
};

export default Users;
