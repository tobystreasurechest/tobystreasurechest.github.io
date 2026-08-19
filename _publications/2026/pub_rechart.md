---
title:          "REChart: Reasoning-Efficient Chart Editing with Large Reasoning Models"
date:           2026-08-17 00:01:00 +0800
selected:       true
# pub:            "IEEE Transactions on Visualization and Computer Graphics(TVCG)"
# pub_pre:        "Submitted to "
pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Spotlight</span>'
# pub_date:       "2025"

abstract: >-
  Chart editing requires inferring and modifying visualization code from a reference chart image based on an editing instruction, challenging fine-grained visual reasoning, instruction following, and executable code synthesis capabilities of MLLMs. Large reasoning models (LRMs) with extended Chain-of-Thought (CoT) reasoning are suitable for tackling such complex multimodal tasks. However, our preliminary study reveals an ``inverted-U'' relationship between reasoning length and chart-editing performance: Excessive reasoning often leads to ``overthinking,'' where models drift toward hallucinated visual details or get stuck in redundant reasoning loops. To address the gap, we introduce REChart, a two-stage training framework that provides process-level supervision over intermediate reasoning steps, improving both editing fidelity and reasoning efficiency. First, we synthesize 200k high-quality reasoning trajectories for supervised fine-tuning from a large image-instruction-code pool, using a role-specialized agentic Reason-Score-Refine workflow that iteratively refine the chart code toward higher quality. Second, we optimize the model via reinforcement learning with two complementary rewards: a fidelity reward evaluating code correctness, visual fidelity, and structural consistency, and an efficiency reward that assigns each rollout a random thinking budget, truncates the reasoning process, and credits the final reasoning segment according to its contribution to the output. On the ChartEdit and ChartMIMIC benchmarks, our model achieves state-of-the-art chart-editing performance among open-source models of comparable scale, while mitigating overthinking and reducing average reasoning token usage by 79.0% under a maximum thinking budget of 16,384 tokens compared with the base model.
cover:          /assets/images/covers/rechart.png
authors:
  - Yuanbang Liu
  - Chenxi Ruan
  - Yihan Hou
  - Qiong Luo
  - Wei Zeng
links:
  Paper: https://arxiv.org/abs/2608.17414
---
