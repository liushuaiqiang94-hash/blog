package com.example.blogapi.mapper;

import com.example.blogapi.domain.AdminUser;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminUserMapper {

    AdminUser findByUsername(@Param("username") String username);

    boolean existsByUsername(@Param("username") String username);

    int insert(AdminUser adminUser);
}
