"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  AITool,
  AIToolContent,
  AIToolHeader,
  AIToolParameters,
  AIToolResult,
} from "@/components/ui/kibo-ui/ai/tool";
import Link from "next/link";
import { ChevronLeft, FileSymlink, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccordionHeader } from "@radix-ui/react-accordion";
import { GetInformationResult } from "@/lib/ai/tools/law-info/getLawInformation";
import { ToolInvocation } from "ai";
import { getToolByName } from "@/lib/ai/tools";

type Props = {
  result: GetInformationResult;
  toolCall: ToolInvocation;
};

export function GetInformation({ result, toolCall }: Props) {
  const name = getToolByName(toolCall.toolName);
  return (
    <AITool key={toolCall.toolCallId}>
      <AIToolHeader
        description={name.description || "Търсене на правна информация"}
        name={name.name}
        status={
          toolCall.state === "result"
            ? "completed"
            : toolCall.state === "call"
              ? "pending"
              : "pending"
        }
      />
      <AIToolContent>
        <AIToolParameters parameters={toolCall.args} />
        {result && (
          <AIToolResult
            error={undefined}
            result={
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="relevant-information">
                  <AccordionTrigger
                    className="text-xs bg-secondary justify-start items-center px-4 w-full font-semibold text-primary hover:text-primary focus-visible:text-primary"
                    value={"relevant-information"}
                  >
                    <span className={"w-12"}>
                      <Scale />
                    </span>
                    <span className="text-xs w-full font-semibold text-primary hover:text-primary focus-visible:text-primary">
                      Референтна информация
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <AccordionHeader className="flex items-center justify-between w-full py-2 rounded-t-md text-xs font-semibold text-muted-foreground hover:text-primary focus-visible:text-primary">
                      <div>
                        <p>
                          <span className="font-semibold">
                            Резултати от търсенето:
                          </span>
                          {result.length > 0
                            ? ` Намерени ${result.length} резултата.`
                            : " Няма намерени резултати."}
                        </p>
                      </div>
                    </AccordionHeader>
                    {result.map((item, index) => (
                      <div key={index} className={`group/item`}>
                        <div
                          className={cn("flex items-center gap-2 mb-2 peer")}
                        >
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className={""}
                          >
                            <Link
                              href={
                                "/dashboard/laws/" +
                                item.slug +
                                "?q=" +
                                (item.content as string).substring(0, 20)
                              }
                            >
                              <FileSymlink />
                            </Link>
                          </Button>

                          <span
                            className={cn(
                              "group-hover/item:opacity-100 opacity-0 transition-opacity duration-300",
                            )}
                          >
                            <span className="text-xs flex items-center font-semibold text-muted-foreground  focus-visible:text-primary">
                              <ChevronLeft className={"h-4 w-4"} />
                              <span className={"ml-1"}>
                                Линк към {item.category as string}
                              </span>
                            </span>
                          </span>
                        </div>

                        <div
                          className={cn(
                            `prose prose-sm peer-hover:text-blue-500 peer-hover:border-primary border-l-2 pl-4 mb-4`,
                            ` transition-color duration-300`,
                          )}
                        >
                          {item.content as string}
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            }
          />
        )}
      </AIToolContent>
    </AITool>
  );
}
