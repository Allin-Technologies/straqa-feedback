'use client'

import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { getClientSideURL } from '@/utilities/getURL'
import { redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PhoneInput } from '@/components/ui/phone-number'
import { Textarea } from '@/components/ui/textarea'

const FormSchema = z.object({
  email: z
    .string({
      required_error: 'Your email is required.',
    })
    .email({ message: 'Your email is required.' }),
  name: z.string().min(1, { message: 'Your name is required.' }),
  tel: z.string().min(1, { message: 'Your phone number is required.' }),
  experience: z.string().min(1, { message: 'Field is required.' }),
  upload: z.string().optional(),
})

const formID = '679e61e98cbf538dd1ded437'

export default function Page() {
  const [file, setFile] = useState<File>()
  const formMethods = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      name: '',
      tel: '',
      experience: '',
      upload: '',
    },
  })

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: z.infer<typeof FormSchema>) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        let uploadBase64: string | undefined

        if (data.upload && data.upload.length > 0 && file) {
          try {
            uploadBase64 = await convertToBase64(file) // Convert file to Base64
          } catch (err) {
            console.error('Error converting file:', err)
            setError({ message: 'File upload failed.' })
            return
          }
        }

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value: name === 'upload' ? uploadBase64 : value, // Attach Base64 string
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)

            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })

            return
          }

          setIsLoading(false)
          // setHasSubmitted(true)
          toast.success('Success', {
            // description:
            //   confirmationType === 'message' ? <RichText data={confirmationMessage} /> : undefined,
          })

          reset()
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      void submitForm()
    },
    [router, redirect, formID],
  )

  return (
    <main className="w-screen lg:min-h-dvh">
      <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-0 py-8 lg:py-12 2xl:py-16 space-y-8 2xl:space-y-16">
        <div className="max-w-[580px] mx-auto gap-8">
          <div className="space-y-4 lg:space-y-6 xl:space-y-8 2xl:space-y-12">
            <h1 className="prose text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-center">
              121 selah - Finding home Tour!
            </h1>

            <Form {...formMethods}>
              <form id={formID} onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
                <div className="space-y-3">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-primary">*</span>Full name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} className="text-black" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-primary">*</span>Email address
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} className="text-black" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="tel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-primary">*</span>Phone
                        </FormLabel>
                        <FormControl>
                          <PhoneInput
                            international={false}
                            placeholder="2340000000000"
                            defaultCountry="NG"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-primary">*</span>How was your experience
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="" {...field} className="text-black" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="upload"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload a picture ( this is not compulsory)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            placeholder=""
                            {...field}
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setFile(file)
                              } else {
                                setFile(undefined)
                              }
                              field.onChange(e)
                            }}
                            className="text-black h-auto"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full py-4 h-auto text-white">
                  {isLoading || isSubmitting ? <Loader2 className="animate-spin size-4" /> : null}
                  <span>Submit</span>
                </Button>
              </form>
            </Form>

            <div className="flex flex-col gap-2 items-center justify-center opacity-75">
              <Image src="/favicon.ico" alt="logo" width={80} height={80} className="size-12" />
              <p>Powered by Straqa</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

const convertToBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString())
      } else {
        reject('Failed to convert file to Base64.')
      }
    }

    reader.onerror = () => {
      reject('File reading failed.')
    }

    reader.readAsDataURL(file) // Converts the file to Base64
  })
}
