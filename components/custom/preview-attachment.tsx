import { Attachment } from "ai";
import { FileText, File, Video, Music, ImageIcon } from "lucide-react";

import { LoaderIcon } from "./icons";

const getFileIcon = (contentType: string) => {
  if (contentType.startsWith("image")) return <ImageIcon className="size-6 text-blue-500" />;
  if (contentType.startsWith("video")) return <Video className="size-6 text-purple-500" />;
  if (contentType.startsWith("audio")) return <Music className="size-6 text-green-500" />;
  if (contentType.includes("pdf")) return <FileText className="size-6 text-red-500" />;
  if (contentType.includes("text") || contentType.includes("json") || contentType.includes("csv")) {
    return <FileText className="size-6 text-orange-500" />;
  }
  return <File className="size-6 text-gray-500" />;
};

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
}: {
  attachment: Attachment;
  isUploading?: boolean;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div className="flex flex-col gap-2 max-w-20">
      <div className="size-20 bg-muted rounded-lg relative flex flex-col items-center justify-center border border-border">
        {contentType ? (
          contentType.startsWith("image") ? (
            // NOTE: it is recommended to use next/image for images
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={name ?? "An image attachment"}
              className="rounded-lg size-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center">
              {getFileIcon(contentType)}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center">
            <File className="size-6 text-gray-500" />
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
            <div className="animate-spin text-white">
              <LoaderIcon />
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground max-w-20 truncate text-center">
        {name}
      </div>
    </div>
  );
};
