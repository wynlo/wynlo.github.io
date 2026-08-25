---
title: "Do Story Points Still Matter in AI-Driven Development?"
slug: "do-story-points-still-matter-in-ai-driven-development"
subtitle: "Code volume was always a weak signal of delivery effort. AI just made it useless."
excerpt: "What story points can still do once agents make implementation cheap: surface the uncertainty that remains, not measure the typing that disappeared."
category: "Engineering"
publishedAt: "2026-07-25T03:00:00.000Z"
readingTime: 4
featured: false
draft: false
---

A coding agent can turn a well-understood change into working code in minutes. It can also spend an afternoon exploring the wrong part of a repository, or produce something that looks complete until somebody tries to verify it.

So do story points still mean anything?

They can, but only for what they were supposed to measure in the first place. Story points were never a reliable measure of typing time. Used well, they give a team a shared language for how uncertain a piece of work is. Used badly, they become a disguised deadline or a productivity score. AI makes the difference hard to ignore, because the typing is now nearly free and the uncertainty is not.

## The work didn't disappear, it moved

Consider a request to add a cancellation reason to an order. The implementation is small: a field, an endpoint change, persistence, display. An agent generates it in one pass. The delivery problem is everything the request didn't say:

- Can every order be cancelled, or only orders in particular states?
- Is the reason free text, a controlled value, or both?
- Does the database change need a staged migration?
- Must the value flow into events, reports, and support tools?
- Is it personal data?
- Which existing clients hit the changed contract?
- What evidence does the team need before releasing it?

Those questions determine the size of the work, and none of them shows up in the diff. Estimating how long the code takes to write was always a rough proxy for delivery effort. Once an agent does the writing, it stops being a proxy for anything.

This is also why AI is not a fixed multiplier you can bake into the scale. The same story is small in a repository with clear boundaries, current docs, and fast tests, and large in one with duplicated rules and slow feedback. How much leverage an agent gives you is a property of the codebase more than the model. And if similar stories keep getting genuinely smaller because the codebase improved, that shows up in cycle time without anyone re-labelling the points.

## The disagreement is the product

When one engineer says two and another says eight, averaging them wastes the moment. The gap usually means something like this: one of them assumed a backward-compatible schema change, and the other expects a coordinated client migration. An agent can execute either approach. It cannot make a decision the team hasn't made.

That conversation is the part of estimation worth keeping. The questions that make it work in an AI-driven team:

- Is the desired behaviour clear enough to verify?
- Is there an established pattern the agent can follow, or is this new ground?
- Which boundaries and integrations change?
- How much of the generated code needs specialist review?
- Are there migrations, rollout constraints, or irreversible steps?
- Does anything depend on a decision or approval outside the team?

Often these questions show that the work should be split: a discovery item to resolve an unknown contract, or a migration separated from its product use. Finding that out is worth more than settling whether the number is five or eight.

## Don't convert agent output into velocity

The most damaging use of points is as a productivity target, and AI makes that use easier to game. A team told to show velocity gains from its agent investment can split tickets smaller, inflate estimates, or accept generated changes before understanding them. The number goes up while review queues grow and defects escape. A developer who rejects a plausible but unsafe generated change delivers fewer visible points and prevents far more work.

Points also can't answer the questions organisations most want them to answer. If the question is when the work will be done, throughput and cycle time from the actual delivery system (agent use, review, and release constraints included) forecast better than any point total. If the question is whether the work was worth doing, you need an outcome connected to why the change was made. Eight points delivered says nothing about either.

## What to actually change

Keep points, if you keep them, for the planning conversation only. Define them around the full path to done, where generated code has no special status and review, correction, and validation are part of the story. Stop using velocity as a target or a cross-team comparison. Forecast from flow metrics instead, and track rework and escaped defects, because that is where any claim that the agent made you faster actually gets tested.

Estimation used to ask how much effort the code would take to write. The more useful question now is how much uncertainty the team has to resolve before it can confidently ship the change. Producing code is cheap. Knowing it is the right code, in the right place, with acceptable consequences, is what you are sizing.
