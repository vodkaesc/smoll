"use client";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UrlFormData, urlSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { shortenUrl } from "@/server/actions/urls/shorten-url";
import { Card, CardContent } from "../ui/card";
import { Copy, Flashlight} from 'lucide-react'

export function UrlShortnerForm() {
    const router = useRouter();
    const pathname = usePathname();

    const [shortUrl, setShorturl] = useState<string | null>(null);
    const [shortCode, setShortCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const form = useForm<UrlFormData>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: "",
        },

    });

    const onSubmit = async (data: UrlFormData) => {
        setIsLoading(true);
        setError(null);
        setShorturl(null);
        setShortCode(null);

        try{
            const formData = new FormData();
            formData.append("url", data.url);
            
            const response = await shortenUrl(formData);
            if(response.success && response.data){
                setShorturl(response.data.shortUrl);
                //Extract the short code from the short URL
                const shortCodeMatch = response.data.shortUrl.match(/\/r\/([^/]+)$/);
                if(shortCodeMatch && shortCodeMatch[1]){
                    setShortCode(shortCodeMatch[1]);
                }
            }
        } catch(error) {
            setError("An error occurred. Please try again");
            console.error(error);
        } finally{
            setIsLoading(false);
        }

    }

    const copyToClipBoard = async () => {
        if(!shortUrl) return;
        try{
            await navigator.clipboard.writeText(shortUrl);
        }  catch (error){
            console.error(error);
        }
    }

    return(
        <>
        <div className="w-full max-w-2xl mx-auto" >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="spy-y-4">
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
                     <Button type="submit" disabled={isLoading}>
                        {
                            isLoading ? (
                                <>
                                <span  className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Shortening...
                                </>
                        ) : (
                            "Shorten"
                        )}
                     </Button>
                </div>

                { error && (
                    <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                        {error}
                    </div>
                )}

                {shortUrl &&  (
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Your shortned URL:</p>
                            <div className="flex items-center gap-2">
                                <Input 
                                type="text"
                                value={shortUrl}
                                readOnly
                                className="font-medium"
                                />
                                <Button type="button"
                                variant={"outline"}
                                className="flex-shrink-0"
                                onClick={copyToClipBoard}  
                                  >
                                    <Copy className="size-4 mr-1"/>
                                    copy
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) }
            </form>
          </Form>
        </div>  
        </>
    );
}