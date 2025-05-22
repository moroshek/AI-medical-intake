"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Mic, MicOff, Send, Edit2, HelpCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"

export default function IntakePage() {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    {
      role: "assistant",
      content:
        "Welcome! I'm your AI Health Assistant. I'm here to help complete your intake faster, so you can see your doctor sooner. This service is completely optional. To start, please tell me your main reason for today's visit.",
    },
  ])
  const [progress, setProgress] = useState(0)
  const [step, setStep] = useState(1)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Simulate the AI thinking and responding
  const simulateAIResponse = () => {
    setIsProcessing(true)

    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)

      let newMessage = ""
      let newProgress = progress
      let newStep = step

      // Different responses based on the current step
      if (step === 1) {
        newMessage = "Thank you for sharing that. How long have you been experiencing these symptoms?"
        newProgress = 33
        newStep = 2
      } else if (step === 2) {
        newMessage = "I understand. Have you taken any medications to help with these symptoms?"
        newProgress = 66
        newStep = 3
      } else if (step === 3) {
        newMessage =
          "Thank you for providing this information. Is there anything else you'd like to share with your doctor before the consultation?"
        newProgress = 100
        newStep = 4
      } else {
        newMessage =
          "Thank you for completing the intake process. Your doctor will review this information before your consultation. You'll be connected with your doctor shortly."
      }

      setMessages((prev) => [...prev, { role: "assistant", content: newMessage }])
      setProgress(newProgress)
      setStep(newStep)
      setTranscript("")
    }, 1500)
  }

  const handleSendMessage = () => {
    if (transcript.trim() === "") return

    setMessages((prev) => [...prev, { role: "user", content: transcript }])
    simulateAIResponse()
  }

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      // In a real app, you would stop the speech recognition here
    } else {
      setIsListening(true)
      // In a real app, you would start the speech recognition here

      // Simulate speech recognition for the demo
      setTimeout(() => {
        const simulatedResponses = [
          "I've been having severe headaches for the past week.",
          "About three days now. They're worse in the morning.",
          "I took some over-the-counter pain relievers but they didn't help much.",
          "I've also been feeling more tired than usual, and I'm concerned it might be related to my blood pressure medication.",
        ]

        setTranscript(simulatedResponses[step - 1] || "")
        setIsListening(false)
      }, 2000)
    }
  }

  const handleEdit = () => {
    setEditMode(true)
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
              <span className="text-white font-semibold">AI</span>
            </div>
            <span className="font-semibold text-lg">MedIntake</span>
          </Link>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-white">
              Step {step} of 4
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Need help? Click here for support</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 max-w-3xl">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">AI Assistant</Badge>
                <span className="text-sm text-gray-500">Secure conversation</span>
              </div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Exit</span>
                </Button>
              </Link>
            </div>
            <Progress value={progress} className="h-1.5 mt-3" />
          </CardHeader>

          <CardContent className="p-4 md:p-6">
            <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user" ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-200"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 md:p-6 md:pt-0">
            <div className="w-full space-y-3">
              {editMode ? (
                <Textarea
                  ref={textareaRef}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Edit your response..."
                  className="resize-none"
                  onBlur={() => setEditMode(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      setEditMode(false)
                    }
                  }}
                />
              ) : (
                transcript && (
                  <div className="relative p-3 bg-gray-100 rounded-lg text-gray-800">
                    {transcript}
                    <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={handleEdit}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              )}

              <div className="flex items-center gap-2">
                <Button
                  variant={isListening ? "destructive" : "outline"}
                  size="icon"
                  className={`rounded-full h-12 w-12 ${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
                  onClick={toggleListening}
                  disabled={isProcessing}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <div className="relative flex-1">
                  {!transcript && !isListening && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-gray-400 text-sm">
                        {isMobile ? "Tap microphone to speak" : "Click microphone to speak or type your response"}
                      </span>
                    </div>
                  )}
                  <Textarea
                    value={editMode ? "" : transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder=""
                    className="resize-none"
                    disabled={isListening || editMode}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && transcript.trim()) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                </div>

                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full h-12 w-12 bg-teal-600 hover:bg-teal-700"
                  onClick={handleSendMessage}
                  disabled={!transcript.trim() || isProcessing}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Your data is encrypted and HIPAA compliant</span>
                </div>
                <button className="text-teal-600 hover:underline">Privacy policy</button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
