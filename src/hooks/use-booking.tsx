import { useEffect, useRef, useState } from "react"
import {
  useGetBookingListQuery,
  useToggleBookingStatusMutation,
} from "../redux/slice/booking-slice"
import { showToast } from "../lib/utils"

const navTabList = [
  {
    id: "1",
    title: "Upcoming",
    slug: "upcoming",
  },
  {
    id: "2",
    title: "Pending",
    slug: "pending",
  },
  {
    id: "3",
    title: "Cancelled",
    slug: "cancelled",
  },
  {
    id: "4",
    title: "Past",
    slug: "past",
  },
]

const useBooking = () => {
  const participantsContainerRef = useRef<HTMLDivElement | null>(null)
  const [activeTab, setActiveTab] = useState(navTabList[0].slug)
  const [openParticipantsFor, setOpenParticipantsFor] = useState("")
  const [toggleStatus, { isLoading }] = useToggleBookingStatusMutation()
  const { data: bookingList } = useGetBookingListQuery(activeTab, {
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        participantsContainerRef.current &&
        !participantsContainerRef.current.contains(event.target as Node)
      ) {
        setOpenParticipantsFor("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleActiveTab = (slug: string) => {
    setActiveTab(slug)
  }

  const handleBookingStatus = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await toggleStatus({ id, status }).unwrap()
      showToast(`Booking has been ${status} successfully`, "success")
    } catch (error) {
      console.log("Something went wrong", error)
    }
  }

  const handleParticipantsClick = (id: string) => {
    setOpenParticipantsFor(id)
  }

  return {
    navTabList,
    activeTab,
    handleActiveTab,
    bookingList,
    handleBookingStatus,
    isLoading,
    participantsContainerRef,
    handleParticipantsClick,
    openParticipantsFor,
  }
}

export default useBooking
