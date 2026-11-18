---
title:          "ColorConceptBench: A Benchmark for Probabilistic Color-Concept Understanding in Text-to-Image Models"
date:           2026-09-25 00:01:00 +0800
selected:       true
pub:            "Advances in Neural Information Processing Systems (NeurlPS 2026), Evaluations & Datasets Track"
# pub_pre:        "Submitted to "
# pub_post:       'Under review.'
# pub_last:       ' <span class="badge badge-pill badge-publication badge-success">Spotlight</span>'
# pub_date:       "2025"

# Abstract source: https://arxiv.org/abs/2601.16836v4
abstract: >-
  Text-to-image (T2I) models have advanced considerably in generating high-quality images from textual descriptions. However, their ability to associate colors with concepts remains largely constrained to explicit color names or codes, while their capacity to handle <em>implicit concepts</em>, such as emotions and visual states, remains underexplored. To address this gap, we introduce ColorConceptBench, an expert-annotated benchmark that systematically evaluates color-concept associations through probabilistic color distributions. ColorConceptBench moves beyond explicit color specifications by examining how models interpret 1,281 implicit color concepts, grounded in 6,584 human annotations. Our evaluation of nine leading T2I models reveals that performance varies substantially across semantic categories, and models exhibit a significant lack of sensitivity to abstract semantics. These limitations persist even when applying classifier-free guidance scaling at inference time, suggesting that achieving human-like color understanding demands a shift in how models learn and represent implicit semantic meaning.
cover:          /assets/images/covers/ccbench.png
authors:
  - Chenxi Ruan
  - Yihan Hou
  - Yu Xiao
  - Guosheng Hu
  - Wei Zeng
links:
  Paper: https://arxiv.org/abs/2601.16836
  Dataset & Code: https://huggingface.co/datasets/ColorConceptBench/ColorConceptBench
---
