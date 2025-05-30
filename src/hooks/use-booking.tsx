import { useEffect, useRef, useState } from "react"
import {
  useGetBookingListQuery,
  useToggleBookingStatusMutation,
} from "../redux/slice/booking-slice"
import { showToast } from "../lib/utils"

// Booking Nav Tab List
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
  const { data: bookingList, isLoading: isDataLoading } =
    useGetBookingListQuery(activeTab, {
      refetchOnMountOrArgChange: true,
    })

  // Reference to toggle the participants list on click
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

  // Handle Active Tab
  const handleActiveTab = (slug: string) => {
    setActiveTab(slug)
  }

  // Handle Booking Status using RTK Query
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
    isDataLoading,
  }
}

export default useBooking
