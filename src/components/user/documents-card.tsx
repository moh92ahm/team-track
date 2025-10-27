'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, ExternalLink, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MultiFileUpload } from '@/components/ui/multi-file-upload'
import type { User, Media } from '@/payload-types'
import Link from 'next/link'

interface DocumentsCardProps {
  user: User
}

export function DocumentsCard({ user }: DocumentsCardProps) {
  const [open, setOpen] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const [deleting, setDeleting] = React.useState<number | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [documentToDelete, setDocumentToDelete] = React.useState<string | number | Media | null>(
    null,
  )
  const [newDocuments, setNewDocuments] = React.useState<(File | string)[]>([])
  const documents = user.documents || []

  const handleUpload = async () => {
    if (newDocuments.length === 0) {
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('userId', String(user.id))

      // Add each file to formData
      newDocuments.forEach((doc, index) => {
        if (typeof doc === 'object' && doc !== null && 'name' in doc) {
          formData.append(`documents[${index}]`, doc as File)
        }
      })

      const response = await fetch(`/api/users/${user.id}/documents`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload documents')
      }

      // Reset and close dialog
      setNewDocuments([])
      setOpen(false)

      // Refresh the page to show new documents
      window.location.reload()
    } catch (error) {
      console.error('Error uploading documents:', error)
      alert('Failed to upload documents. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (doc: string | number | Media) => {
    setDocumentToDelete(doc)
    setShowDeleteDialog(true)
  }

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return

    const docId = getDocId(documentToDelete)
    setDeleting(Number(docId))
    try {
      const response = await fetch(`/api/users/${user.id}/documents/${docId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      // Refresh the page to show updated documents
      window.location.reload()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Failed to delete document. Please try again.')
    } finally {
      setDeleting(null)
      setShowDeleteDialog(false)
      setDocumentToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false)
    setDocumentToDelete(null)
  }

  const getDocId = (doc: string | number | Media): string | number => {
    if (typeof doc === 'object' && doc && 'id' in doc) {
      return doc.id
    }
    return doc
  }

  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documents
            </CardTitle>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Upload Documents</DialogTitle>
                  <DialogDescription>
                    Add documents for {user.fullName}. You can upload up to 10 files at once.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <MultiFileUpload
                    value={newDocuments}
                    onChange={setNewDocuments}
                    name="documents"
                    label=""
                    placeholder="Click or drag files to upload"
                    maxFiles={10}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setOpen(false)
                      setNewDocuments([])
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploading || newDocuments.length === 0}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
        </CardContent>
      </Card>
    )
  }

  const getFileName = (doc: string | number | Media): string => {
    if (typeof doc === 'object' && doc && 'filename' in doc) {
      return doc.filename || 'Document'
    }
    return 'Document'
  }

  const getFileUrl = (doc: string | number | Media): string | null => {
    if (typeof doc === 'object' && doc && 'url' in doc) {
      return doc.url || null
    }
    return null
  }

  const getFileSize = (doc: string | number | Media): string => {
    if (typeof doc === 'object' && doc && 'filesize' in doc && doc.filesize) {
      const bytes = doc.filesize
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }
    return ''
  }

  const getMimeType = (doc: string | number | Media): string => {
    if (typeof doc === 'object' && doc && 'mimeType' in doc && doc.mimeType) {
      return doc.mimeType.split('/')[1]?.toUpperCase() || 'FILE'
    }
    return 'FILE'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents ({documents.length})
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Upload Documents</DialogTitle>
                <DialogDescription>
                  Add documents for {user.fullName}. You can upload up to 10 files at once.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <MultiFileUpload
                  value={newDocuments}
                  onChange={setNewDocuments}
                  name="documents"
                  label=""
                  placeholder="Click or drag files to upload"
                  maxFiles={10}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false)
                    setNewDocuments([])
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading || newDocuments.length === 0}
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((doc, index) => {
            const fileName = getFileName(doc)
            const fileUrl = getFileUrl(doc)
            const fileSize = getFileSize(doc)
            const fileType = getMimeType(doc)
            const docId = getDocId(doc)
            const isDeleting = deleting === Number(docId)

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-md border hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{fileName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {fileType && <span className="font-mono">{fileType}</span>}
                      {fileSize && (
                        <>
                          <span>•</span>
                          <span>{fileSize}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {fileUrl && (
                    <>
                      <a href={fileUrl} download target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </a>
                      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDelete(doc)}
                    disabled={isDeleting}
                    title="Delete document"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
