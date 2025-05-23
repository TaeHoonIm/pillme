package com.americanstartup.pillme.history.application;

import static com.americanstartup.pillme.global.code.ErrorCode.HISTORY_NOT_FOUND;
import static com.americanstartup.pillme.global.code.ErrorCode.MEMBER_NOT_MATCHED;

import com.americanstartup.pillme.auth.domain.entity.Member;
import com.americanstartup.pillme.history.application.exception.HistoryNotFoundException;
import com.americanstartup.pillme.history.application.exception.MemberNotMatchedException;
import com.americanstartup.pillme.history.application.response.HistoryDetailResponse;
import com.americanstartup.pillme.history.application.response.HistorySearchResponse;
import com.americanstartup.pillme.history.domain.History;
import com.americanstartup.pillme.history.domain.dto.HistoryChangeDto;
import com.americanstartup.pillme.history.domain.item.PatchHistoryItem;
import com.americanstartup.pillme.history.infrastructure.HistoryRepository;
import com.americanstartup.pillme.history.presentation.request.PatchHistoryRequest;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;

    @Transactional(readOnly = true)
    public List<HistorySearchResponse> selectHistoryTarget(final Long targetId) {
        List<History> histories = historyRepository.findByReaderIdFetch(targetId);

        return histories.stream()
                .map(HistorySearchResponse::of)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<HistoryDetailResponse> selectHistoryByInformationId(
            final Long informationId,
            final Long target
    ) {
        List<History> historyList = historyRepository.findHistoryByInformationId(informationId, target);

        if (historyList.isEmpty()) {
            throw new HistoryNotFoundException(HISTORY_NOT_FOUND);
        }

        return historyList.stream()
                .map(HistoryDetailResponse::of)
                .collect(Collectors.toList());
    }

    public void patchHistories(
            final PatchHistoryRequest request,
            final Member member
    ) {
        List<Long> historyIds = request.modifyList().stream()
                .map(PatchHistoryItem::historyId)
                .toList();

        Map<Long, HistoryChangeDto> changeDtoMap = request.modifyList().stream()
                .collect(Collectors.toMap(
                        PatchHistoryItem::historyId,
                        PatchHistoryItem::toHistoryChangeDto
                ));

        List<History> historyList = historyRepository.findByIdInAndDeletedIsFalse(historyIds);

        for (History history : historyList) {
            checkHistoryValidation(history, member);
            changeHistory(history, changeDtoMap.get(history.getId()));
        }
    }

    private void changeHistory(
            final History history,
            final HistoryChangeDto changeInformation
    ) {
        history.changeTakingInformation(changeInformation);
    }

    public void deleteHistory(final Long id) {
        History history = historyRepository.findByIdFetch(id)
                .orElseThrow(() -> new HistoryNotFoundException(HISTORY_NOT_FOUND));
        history.delete();
    }

    private void checkHistoryValidation(
            final History history,
            final Member member
    ) {
        if (!history.getMember().getId().equals(member.getId())) {
            throw new MemberNotMatchedException(MEMBER_NOT_MATCHED);
        }
    }
}
