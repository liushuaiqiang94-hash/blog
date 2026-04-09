package com.example.blogapi.mapper;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostMapper {

    List<Post> findAllByStatusOrderByPublishedAtDesc(@Param("status") PostStatus status);

    Post findBySlugAndStatus(@Param("slug") String slug, @Param("status") PostStatus status);

    boolean existsBySlug(@Param("slug") String slug);
}
