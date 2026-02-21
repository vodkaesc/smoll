"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UrlFormData, urlSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function UrlShortnerForm() {


    const form = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: "",
        },

    });

    return(
        <>
        <div className="w-full max-w-2xl mx-auto" >
          <Form {...form}>
            <form className="spy-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                    <FormField
                    control={form.control}
                    name="url"
                    render={({field}) =>(
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                placeholder="Paste your long URL here"
                                {...field}
                                disabled={false}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                     />
                     <Button type="submit" disabled={false}>
                        Shorten
                     </Button>
                </div>
            </form>
          </Form>
        </div>  
        </>
    );
}