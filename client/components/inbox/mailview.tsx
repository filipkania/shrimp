import {
  AlertCircleIcon,
  ArchiveIcon,
  ClockIcon,
  ForwardIcon,
  MoreVerticalIcon,
  ReplyAllIcon,
  ReplyIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";

export const MailView = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 h-[64px] w-full inline-flex justify-between items-center border-b">
        <div className="inline-flex h-6 items-center gap-1">
          <Button size="icon" variant="ghost">
            <ArchiveIcon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <Trash2Icon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <AlertCircleIcon className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" />

          <Button size="icon" variant="ghost">
            <ClockIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="inline-flex h-6 items-center gap-1">
          <Button size="icon" variant="ghost">
            <ReplyIcon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <ReplyAllIcon className="w-4 h-4" />
          </Button>

          <Button size="icon" variant="ghost">
            <ForwardIcon className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" />

          <Button size="icon" variant="ghost">
            <MoreVerticalIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

        <div className="w-full border-b px-6 py-4 flex gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src="https://github.com/filipkania.png" />
            <AvatarFallback />
          </Avatar>

          <div className="flex items-start w-full">
            <div className="flex flex-col">
              <span className="font-medium">Filip Kania</span>

              <span className="text-sm">Meeting details</span>
              <span className="text-sm text-muted-foreground">
                Reply-To: <code>me@fkrq.xyz</code>
              </span>
            </div>
            <span className="ml-auto text-sm text-muted-foreground">
              12/01/2024
            </span>
          </div>
        </div>

      <ScrollArea className="h-full">
        <blockquote className="p-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
          eveniet nam ullam <b>voluptatem deleniti perspiciatis repudiandae</b>{" "}
          incidunt sunt nobis nihil, architecto, recusandae corrupti libero{" "}
          <i>sit facilis</i> commodi velit omnis enim.
          <br />
          <br />
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!Lorem ipsum dolor sit amet
          consectetur, adipisicing elit. Illum officiis error totam{" "}
          <u>molestiae facere</u> ratione fugiat blanditiis autem aliquid sequi
          velit debitis <s>itaque deleniti</s>, laborum, placeat voluptate
          quidem nam sunt!Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Illum officiis error totam <u>molestiae facere</u> ratione
          fugiat blanditiis autem aliquid sequi velit debitis{" "}
          <s>itaque deleniti</s>, laborum, placeat voluptate quidem nam
          sunt!Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illum
          officiis error totam <u>molestiae facere</u> ratione fugiat blanditiis
          autem aliquid sequi velit debitis <s>itaque deleniti</s>, laborum,
          placeat voluptate quidem nam sunt!
          <br />
          <br />
          Pzdr, Filip.
        </blockquote>
      </ScrollArea>

      <div className="w-full border-t px-6 py-4 flex flex-col gap-2 justify-end">
        <Textarea className="[form-sizing:normal]" /> 

        <div className="flex justify-end">
          <Button variant="outline">Send</Button>
        </div>
      </div>
    </div>
  );
};
