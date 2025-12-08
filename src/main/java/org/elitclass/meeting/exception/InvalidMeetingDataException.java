package org.elitclass.meeting.exception;

public class InvalidMeetingDataException extends RuntimeException {
    public InvalidMeetingDataException(String message) {
        super(message);
    }
}