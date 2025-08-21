import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import DocsSearchDialog from "@/app/components/search";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { FaUser } from "react-icons/fa";

function SearchDialog() {
  const users = useQuery(api.users.list) || [];

  const sections = [
    {
      title: "All Users",
      items: users.map((u: any) => ({
        id: u._id,
        label: u.fullName,
        node: (
          <div className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-sm rounded-md">
            <div className="flex flex-col text-left">
              <span className="font-medium">{u.fullName}</span>
              <span className="text-sm text-muted-foreground">{u.emailAddress}</span>
            </div>
            <div className="flex-shrink-0">{u.role}</div>
          </div>
        ),
      })),
    },
  ];

  return (
    <DocsSearchDialog
      placeholder="Search name..."
      noItemFoundText="No user found"
      sections={sections}
      trigger={
        <Button className="flex items-center gap-2 px-3 py-2 text-sm h-10 text-muted-foreground bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground transition-colors pr-20">
          <Search className="h-4 w-4" />
          <span>Search name....</span>
        </Button>
      }
      footerOptions={{
        footerNode: (
          <div className="flex items-center p-4 px-5 gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-full border dark:bg-neutral-900">
              <FaUser className="text-gray-500" />
            </div>
            <span className="text-[13px] font-medium text-muted-foreground">
              {users.length} existing user
            </span>
          </div>
        ),
      }}
    />
  );
}

export default SearchDialog;
