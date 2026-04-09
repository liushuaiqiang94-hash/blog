package com.example.blogapi.mapper;

import com.example.blogapi.domain.Post;
import com.example.blogapi.domain.PostStatus;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PostMapper {

    List<Post> findAllOrderByCreatedAtDesc();

    List<Post> findAllByStatusOrderByPublishedAtDesc(@Param("status") PostStatus status);

    Post findById(@Param("id") Long id);

    Post findBySlug(@Param("slug") String slug);

    Post findBySlugAndStatus(@Param("slug") String slug, @Param("status") PostStatus status);

    boolean existsBySlug(@Param("slug") String slug);

    int insert(Post post);

    int update(Post post);

    int deleteById(@Param("id") Long id);
}
