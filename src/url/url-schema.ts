import z from "zod";

const URL_REGEX =
  /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

export const UrlSchema = z.object({
  urlAddress: z.string().refine((val: string) => {
    return URL_REGEX.test(val);
  }),
});

export type UrlDTO = z.infer<typeof UrlSchema>;
