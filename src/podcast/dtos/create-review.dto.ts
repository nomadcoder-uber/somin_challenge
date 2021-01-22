import { Field, InputType, Int, ObjectType, PickType } from "@nestjs/graphql";
import { Review } from "../entities/review.entity";
import { CoreOutput } from "./output.dto";

@InputType()
export class CreateReviewInput extends PickType(Review, [
  "contents",
  "rating",
]) {
  @Field((type) => Int)
  podcastId: number;

  @Field((type) => Int)
  userId: number;
}

@ObjectType()
export class CreateReviewOutput extends CoreOutput {}
