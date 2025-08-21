// app/calendar/EventModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { EventInput } from '@fullcalendar/core'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Calendar,
  Clock,
  Users,
  Video,
  Trash2,
  Edit,
  Save,
  X,
  Plus
} from 'lucide-react'

interface EventModalProps {
  open: boolean
  onClose: () => void
  event: EventInput | null
  mode: 'create' | 'edit' | 'view'
  onSave: (eventData: any) => void
  onDelete: (eventId: string) => void
  onEdit: () => void
  loading: boolean
}

export default function EventModal({
  open,
  onClose,
  event,
  mode,
  onSave,
  onDelete,
  onEdit,
  loading
}: EventModalProps) {
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    attendees: [] as string[],
  })
  const [newAttendee, setNewAttendee] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (event) {
      // Format dates for datetime-local input
      const formatDateForInput = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toISOString().slice(0, 16)
      }

      setFormData({
        summary: event.title?.toString() || '',
        description: event.extendedProps?.description || '',
        start: formatDateForInput(event.start?.toString() || ''),
        end: formatDateForInput(event.end?.toString() || ''),
        allDay: event.allDay || false,
        attendees: event.extendedProps?.attendees || [],
      })
    }
  }, [event])

  const handleSave = () => {
    const eventData = {
      ...formData,
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
    }

    if (mode === 'edit' && event?.id) {
      eventData.id = event.id
    }

    onSave(eventData)
  }

  const handleAddAttendee = () => {
    if (newAttendee && !formData.attendees.includes(newAttendee)) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee]
      }))
      setNewAttendee('')
    }
  }

  const handleRemoveAttendee = (email: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== email)
    }))
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }

  if (!event) return null

  const isEditing = mode === 'edit' || mode === 'create'
  const title = mode === 'create' ? 'Create Event' : mode === 'edit' ? 'Edit Event' : event.title

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="summary">Title</Label>
                  <Input
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Event title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="all-day"
                    checked={formData.allDay}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allDay: checked }))}
                  />
                  <Label htmlFor="all-day">All day event</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Start {!formData.allDay && 'Time'}</Label>
                    <Input
                      id="start"
                      type={formData.allDay ? "date" : "datetime-local"}
                      value={formData.allDay ? formData.start.split('T')[0] : formData.start}
                      onChange={(e) => {
                        let value = e.target.value
                        if (formData.allDay) {
                          value += 'T00:00:00'
                        }
                        setFormData(prev => ({ ...prev, start: value }))
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end">End {!formData.allDay && 'Time'}</Label>
                    <Input
                      id="end"
                      type={formData.allDay ? "date" : "datetime-local"}
                      value={formData.allDay ? formData.end.split('T')[0] : formData.end}
                      onChange={(e) => {
                        let value = e.target.value
                        if (formData.allDay) {
                          value += 'T23:59:59'
                        }
                        setFormData(prev => ({ ...prev, end: value }))
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Attendees</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newAttendee}
                      onChange={(e) => setNewAttendee(e.target.value)}
                      placeholder="Add attendee email"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddAttendee()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddAttendee}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {formData.attendees.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.attendees.map((attendee) => (
                        <Badge
                          key={attendee}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {attendee}
                          <button
                            onClick={() => handleRemoveAttendee(attendee)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              // View mode
              <div className="space-y-4">
                {event.extendedProps?.description && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                    <p className="text-sm mt-1">{event.extendedProps.description}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Time</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    {event.allDay ? (
                      <span>All day</span>
                    ) : (
                      <span>
                        {formatDateTime(event.start?.toString() || '')} - {formatDateTime(event.end?.toString() || '')}
                      </span>
                    )}
                  </div>
                </div>

                {event.extendedProps?.attendees?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Attendees</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{event.extendedProps.attendees.length} attendees</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.extendedProps.attendees.map((attendee: string) => (
                        <Badge key={attendee} variant="outline" className="text-xs">
                          {attendee}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {event.extendedProps?.videoConferenceLink && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Video Conference</h4>
                    <a
                      href={event.extendedProps.videoConferenceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Video className="w-4 h-4" />
                      Join meeting
                    </a>
                  </div>
                )}

                <Separator />

                <div className="text-xs text-muted-foreground">
                  Response Status: {event.extendedProps?.responseStatus || 'accepted'}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {mode === 'view' && (
              <>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {event.id && (
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
              </>
            )}

            {isEditing && (
              <>
                <Button variant="outline" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading || !formData.summary}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (event?.id) {
                  onDelete(event.id.toString())
                }
                setShowDeleteDialog(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
