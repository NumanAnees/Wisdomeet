import React from "react";
import TopicCard from "../Home/TopicCard";
import { handleFollowUnfollow } from "../../helpers/topicHelpers";
import NoDataMessage from "../NoDataMessage";

const TopicTab = ({ topics, getUser }) => {
  const handleFollowUnfollowBtn = async (id) => {
    try {
      await handleFollowUnfollow(id);
      getUser();
    } catch (err) {
      console.error("There was a problem with the request:", err);
      toast.error("Something went wrong!");
    }
  };
  return (
    <>
      {topics?.length > 0 ? (
        topics.map((topic) => {
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              handleFollowUnfollowBtn={handleFollowUnfollowBtn}
              NoFollowButton={false}
            />
          );
        })
      ) : (
        <NoDataMessage text="Followed Topics..." />
      )}
    </>
  );
};

export default TopicTab;
