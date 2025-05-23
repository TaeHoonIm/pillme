package com.americanstartup.pillme.auth.infrastructure.repository;

import com.americanstartup.pillme.auth.domain.entity.Member;
import com.americanstartup.pillme.auth.domain.vo.Gender;
import com.americanstartup.pillme.auth.domain.vo.Provider;
import com.americanstartup.pillme.auth.domain.vo.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmailAndDeletedFalseAndRoleNot(String email, Role role);

    Optional<Member> findByPhoneAndDeletedFalseAndRoleNot(String phone, Role role);

    Optional<Member> findByEmailAndPhoneAndDeletedFalse(String email, String phone);

    boolean existsByEmailAndDeletedFalse(String email);

    boolean existsByEmailAndRoleNotAndDeletedFalse(String email, Role role);

    boolean existsByNicknameAndDeletedFalse(String nickname);

    boolean existsByPhoneAndDeletedFalse(String phone);

    Optional<Member> findByEmailAndProviderAndDeletedFalse(String email, Provider provider);

    Optional<Member> findByIdAndDeletedFalse(Long id);

    Optional<Member> findByPhoneAndDeletedFalse(String phone);

    boolean existsByNameAndGenderAndBirthday(String name, Gender gender, String birthday);

    Optional<Member> findByNameAndGenderAndBirthdayAndDeletedFalse(String name, Gender gender, String birthday);
}