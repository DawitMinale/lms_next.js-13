"use client"
import { ReactNode } from "react"
import { AlertDialog ,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger

} from "../ui/alert-dialog"

interface ConfirmModalProps{
    children:ReactNode,
    onConfirm:()=>void
}
import React from 'react'

const ConfirmModal = ({children,onConfirm}:ConfirmModalProps) => {
  return (
    <AlertDialog>
        <AlertDialogTrigger asChild>
            {children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are You Sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmModal