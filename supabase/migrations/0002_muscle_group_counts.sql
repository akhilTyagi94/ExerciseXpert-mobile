-- The Targets tab lists each muscle group with its exercise count. Doing
-- that aggregation in the database (once, via a view) is simpler and faster
-- than fetching every exercise_muscles row client-side just to count them.
create view muscle_group_exercise_counts as
select
  mg.id,
  mg.slug,
  mg.name,
  count(distinct em.exercise_id) as exercise_count
from muscle_groups mg
left join exercise_muscles em on em.muscle_group_id = mg.id
group by mg.id, mg.slug, mg.name;

alter view muscle_group_exercise_counts set (security_invoker = on);
