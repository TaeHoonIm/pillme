package com.americanstartup.pillme.global.code;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SuccessCode {
    REQUEST_SUCCESS(2000, OK, "요청이 성공적으로 처리되었습니다"),


    // 복약 관리
    INFORMATION_SAVE_SUCCESS(2100, CREATED, "복약 정보가 성공적으로 등록되었습니다."),
    MANAGEMENT_CHANGE_SUCCESS(2101, OK, "복약 정보 갱신이 성공적으로 처리되었습니다."),
    INFORMATION_ADD_SUCCESS(2102, OK, "복약 정보 추가가 성공적으로 처리되었습니다."),
    INFORMATION_ADD_REQUEST_SUCCESS(2103, OK, "복약 정보 추가가 성공적으로 요청되었습니다."),
    MEDICATION_CHECK_SUCCESS(2104, OK, "복약 정보 단일 체크가 성공적으로 처리되었습니다."),
    INFORMATION_DELETE_REQUEST_REJECT_SUCCESS(2105, OK, "복약 정보 삭제 요청을 거절했습니다."),
    INFORMATION_DELETE_SUCCESS(2105, OK, "복약 정보를 성공적으로 삭제하였습니다."),
    INFORMATION_DELETE_REQUEST_SUCCESS(2106, OK, "복약 정보 삭제 요청이 성공적으로 처리되었습니다."),

    // 약물 검색
    MEDICATION_SEARCH_SUCCESS(2200, OK, "약물 검색이 성공적으로 완료되었습니다"),

    //채팅
    CHATROOM_DELETE_SUCCESS(2200, OK, "요청하신 채팅방이 삭제되었습니다."),
    CHATROOM_LEAVE_SUCCESS(2201, OK, "사용자가 채팅방에서 나갔습니다.");

    private final int code;
    private final HttpStatus httpStatus;
    private final String message;
}