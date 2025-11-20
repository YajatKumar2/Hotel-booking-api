/* We need to define the user roles firstt */

export enum UserRole{
    GUEST = 'guest',
    STAFF = 'staff',
    ADMIN = 'admin',
}

/* We need some room types */

export enum RoomType{
    SINGLE = 'single',
    DOUBLE = 'double',
    SUITE = 'suite'
}

/*What is the status of the booking*/

export enum BookingStatus{
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
}