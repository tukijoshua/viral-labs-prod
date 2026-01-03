import { UploadZone } from "@/components/dashboard/upload-zone";
import { WelcomeMessage } from "@/components/dashboard/welcome-message";

export default function DashboardPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-8">
        <WelcomeMessage />
        <UploadZone />
      </div>
    </div>
  );
}
